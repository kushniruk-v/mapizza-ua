import { RouterModule, Routes } from "@angular/router";
import { KontaktyComponent } from "./kontakty.component";
import { NgModule } from "@angular/core";

const routes: Routes =[
    {
        path:'', component:KontaktyComponent
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KontaktyRoutingModule { }