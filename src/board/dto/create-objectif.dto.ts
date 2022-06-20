export class CreateObjectifdDto {
  objectif_key?: string;
  title: string;
  description: string;
  due_date: Date;
  status?: string;
  priority?: string;
  labels?: string;
  assign?: string;
}
