import {APIService} from "@/service/api";
import { DB } from "@/interface";
import {IRenderService} from "@/service/render/interfaces";

export type Services<T> = {
  render: IRenderService,
  api: APIService,
  db: DB<T>
}

