import {CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { TovaryComponent } from "./tovary.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared/shared.module";
import { TovaryRoutingModule } from "./tovary-routing.module";
import { TovaryInfoComponent } from "./tovary-info/tovary-info.component";

@NgModule({
    declarations:[
TovaryComponent,
TovaryInfoComponent,

    ],
    imports:[
CommonModule,
SharedModule,
TovaryRoutingModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TovaryModule { }