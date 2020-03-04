import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {Bulb} from './base/bulb';
import {Ground} from './base/ground';
import {LightContext} from './services/light.context';
import {MaterialService} from './services/material.service';
import {provideGameObject} from './services/game-object.factory';
import {ContainerGameObject} from './game-objects/container.game-object';
import {BoxGameObject} from './game-objects/box.game-object';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SearchComponent} from './ui/search/search.component';
import {SearchContext} from './services/search.context';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatOptionModule} from '@angular/material/core';

@NgModule({
    declarations: [
        AppComponent,
        SearchComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatOptionModule,
        MatAutocompleteModule,
    ],
    providers: [
        provideGameObject(ContainerGameObject),
        provideGameObject(BoxGameObject, [LightContext, MaterialService, SearchContext]),
        provideGameObject(Ground, [MaterialService]),
        provideGameObject(Bulb, [LightContext, MaterialService]),

    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
