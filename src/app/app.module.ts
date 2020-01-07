import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {Ground} from './base/ground';
import {LightService} from './services/light.service';
import {MaterialService} from './services/material.service';
import {provideSlot} from './services/slot-factory.service';
import {SlotContainer} from './slot/slot-container';
import {SlotBox} from './slot/slot-box';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
    ],
    providers: [
        provideSlot(SlotContainer),
        provideSlot(SlotBox, [LightService, MaterialService]),
        provideSlot(Ground, [MaterialService]),

    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
