export interface ICareerRequest {
  name: string;
  title: string;
  description: string;
  imagePath: string;
}

export interface ICareerResponse extends ICareerRequest {
  id: number | string;
}
