export interface IAdditionalComponensReguest {
  name: string;
  weight: string;
  price: string;
  imagePath: string;
  class: string;
}
export interface IAdditionalComponensResponse
  extends IAdditionalComponensReguest {
  id: number | string;
}
