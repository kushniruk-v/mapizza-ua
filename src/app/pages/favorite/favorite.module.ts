import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FavoriteRoutingModule } from "./favorite-routing.module";
import { SharedModule } from "../../shared/shared.module";
import { FavoriteComponent } from "./favorite.component";

@NgModule({
    declarations:[FavoriteComponent],
    imports:[
        CommonModule,
        FavoriteRoutingModule,
        SharedModule
    ]
})
export class FavoriteModule { }