import {ToggleButton, ToggleButtonConfig} from './togglebutton';
import {UIInstanceManager} from '../uimanager';

/**
 * A button that toggles Apple AirPlay.
 */
export class AirPlayToggleButton extends ToggleButton<ToggleButtonConfig> {

  constructor(config: ToggleButtonConfig = {}) {
    super(config);

    this.config = this.mergeConfig(config, {
      cssClass: 'ui-airplaytogglebutton',
      text: 'Apple AirPlay',
    }, this.config);
  }

  configure(player: bitmovin.PlayerAPI, uimanager: UIInstanceManager): void {
    super.configure(player, uimanager);

    if (!player.isAirplayAvailable) {
      // If the player does not support Airplay (player 7.0), we just hide this component and skip configuration
      this.hide();
      return;
    }

    this.onClick.subscribe(() => {
      if (player.isAirplayAvailable()) {
        player.showAirplayTargetPicker();
      } else {
        if (console) {
          console.log('AirPlay unavailable');
        }
      }
    });

    let airPlayAvailableHandler = () => {
      if (player.isAirplayAvailable()) {
        this.show();
      } else {
        this.hide();
      }
    };

    player.addEventHandler(player.EVENT.ON_AIRPLAY_AVAILABLE, airPlayAvailableHandler);

    // Startup init
    airPlayAvailableHandler(); // Hide button if AirPlay is not available
  }
}