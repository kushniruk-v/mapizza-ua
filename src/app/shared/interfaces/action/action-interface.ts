export interface IActionRequest {
  name: string;
  title: string;
  description: string;
  imagePath: string;
  newFormAction: Array<{
    additionalImage: string;
    additionalList: string;
  }>;
}

export interface IActionResponse extends IActionRequest {
  id: number | string;
}
