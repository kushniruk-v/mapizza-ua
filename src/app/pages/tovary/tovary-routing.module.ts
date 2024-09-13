import { RouterModule, Routes } from "@angular/router";
import { TovaryInfoComponent } from "./tovary-info/tovary-info.component";
import { TovaryComponent } from "./tovary.component";
import { TovaryInfoResolver } from "../../shared/services/tovary/tovary-info.resolver";
import { NgModule } from "@angular/core";


const routes: Routes= [
    {path: ':category', component: TovaryComponent},
    {path: ':category/:id', component:TovaryInfoComponent,
        resolve: { tovaryInfo: TovaryInfoResolver } 
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    
})
export class TovaryRoutingModule { }