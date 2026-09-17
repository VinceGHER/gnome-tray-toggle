import GObject from 'gi://GObject';
import St from 'gi://St';
import Clutter from 'gi://Clutter';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';

const SYSTEM_ROLES = new Set([
    'activities',
    'appMenu',
    'dateMenu',
    'quickSettings',
    'keyboard',
    'a11y',
    'dwellClick',
    'screenSharing',
    'screenRecording',
    'unsafeModeMenu',
    'remoteAccess',
    'thunderbolt',
    'tray-toggle',
]);

function isApplicationTrayRole(role) {
    return role.startsWith('appindicator-');
}

function getPanelBoxes() {
    return [Main.panel._leftBox, Main.panel._centerBox, Main.panel._rightBox]
        .filter(box => box);
}

const TrayToggleButton = GObject.registerClass(
class TrayToggleButton extends PanelMenu.Button {
    _init() {
        // GNOME 50: creating a menu enables an internal ClickGesture that
        // swallows presses, so button-press-event never runs.
        super._init(0.0, 'Tray Toggle', true);

        this._trayVisible = true;
        this._hiddenActors = [];
        this._boxConnections = [];
        this._iconAnim = 0;

        this._icon = new St.Icon({
            icon_name: 'orientation-portrait-right-symbolic',
            style_class: 'system-status-icon',
        });
        this._icon.set_pivot_point(0.5, 0.5);
        this.add_child(this._icon);

        this._connectActivation();
        this._watchPanelBoxes();
    }

    _connectActivation() {
        if (this._clickGesture) {
            this._clickGesture.connect('recognize', () => this._toggleTray());
            this._clickGesture.set_enabled(true);
            return;
        }

        if (Clutter.ClickGesture) {
            this._ownClickGesture = new Clutter.ClickGesture();
            this._ownClickGesture.set_recognize_on_press(true);
            this._ownClickGesture.connect('recognize', () => this._toggleTray());
            this.add_action(this._ownClickGesture);
            return;
        }

        this.connect('button-press-event', () => {
            this._toggleTray();
            return Clutter.EVENT_STOP;
        });
    }

    _watchPanelBoxes() {
        for (const box of getPanelBoxes()) {
            const id = box.connect('child-added', () => {
                if (!this._trayVisible)
                    this._hideTray();
            });
            this._boxConnections.push([box, id]);
        }
    }

    _toggleTray() {
        this._trayVisible = !this._trayVisible;
        this._updateTrayVisibility();
    }

    _updateTrayVisibility() {
        this._animateIcon();

        if (this._trayVisible)
            this._showTray();
        else
            this._hideTray();
    }

    _animateIcon() {
        const targetName = this._trayVisible
            ? 'orientation-portrait-right-symbolic'
            : 'orientation-portrait-left-symbolic';

        this._iconAnim++;
        const anim = this._iconAnim;

        this._icon.remove_all_transitions();
        this._icon.rotation_angle_z = 0;
        this._icon.set_pivot_point(0.5, 0.5);

        this._icon.ease({
            opacity: 0,
            duration: 90,
            mode: Clutter.AnimationMode.EASE_IN_QUAD,
            onComplete: () => {
                if (anim !== this._iconAnim)
                    return;

                this._icon.icon_name = targetName;
                this._icon.ease({
                    opacity: 255,
                    duration: 90,
                    mode: Clutter.AnimationMode.EASE_OUT_QUAD,
                });
            },
        });
    }

    _getTrayActors() {
        const actors = [];
        const seen = new Set();

        const addActor = actor => {
            if (!actor || seen.has(actor) || actor === this.container)
                return;
            seen.add(actor);
            actors.push(actor);
        };

        for (const [role, indicator] of Object.entries(Main.panel.statusArea)) {
            if (!indicator || SYSTEM_ROLES.has(role))
                continue;
            if (!isApplicationTrayRole(role))
                continue;
            addActor(indicator.container ?? indicator);
        }

        if (actors.length > 0)
            return actors;

        const systemContainers = new Set();
        for (const role of SYSTEM_ROLES) {
            const item = Main.panel.statusArea[role];
            if (item?.container)
                systemContainers.add(item.container);
        }

        const boxes = [Main.panel._rightBox, Main.panel._centerBox].filter(Boolean);
        for (const box of boxes) {
            for (const child of box.get_children()) {
                if (child === this.container || systemContainers.has(child))
                    continue;

                let ownedByStatusArea = false;
                for (const indicator of Object.values(Main.panel.statusArea)) {
                    if (indicator?.container === child) {
                        ownedByStatusArea = true;
                        break;
                    }
                }

                if (ownedByStatusArea)
                    addActor(child);
            }
        }

        return actors;
    }

    _hideTray() {
        const alreadyHidden = new Set(this._hiddenActors);

        for (const child of this._getTrayActors()) {
            if (alreadyHidden.has(child) || !child.visible)
                continue;

            this._hiddenActors.push(child);
            child.ease({
                opacity: 0,
                translation_x: 50,
                duration: 250,
                mode: Clutter.AnimationMode.EASE_IN_OUT_QUAD,
                onComplete: () => {
                    child.hide();
                    child.translation_x = 0;
                },
            });
        }
    }

    _showTray() {
        for (const actor of this._hiddenActors) {
            if (!actor)
                continue;

            actor.opacity = 0;
            actor.translation_x = 50;
            actor.show();
            actor.ease({
                opacity: 255,
                translation_x: 0,
                duration: 250,
                mode: Clutter.AnimationMode.EASE_IN_OUT_QUAD,
            });
        }
        this._hiddenActors = [];
    }

    destroy() {
        for (const [box, id] of this._boxConnections) {
            box.disconnect(id);
        }
        this._boxConnections = [];

        if (!this._trayVisible)
            this._showTray();

        super.destroy();
    }
});

export default class TrayToggleExtension {
    constructor() {
        this._button = null;
    }

    enable() {
        this._button = new TrayToggleButton();
        Main.panel.addToStatusArea('tray-toggle', this._button, 1, 'right');
    }

    disable() {
        if (this._button) {
            this._button.destroy();
            this._button = null;
        }
    }
}
