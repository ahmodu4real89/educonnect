import { GetProp, UploadProps } from "antd";

export type TRequestQuery= Partial<{page:number, pageSize: number, field: string, value: string}>

export  type TRole = "ADMIN" | "LECTURER" | "STUDENT"

export type TAntdFileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export type TActionResponse<D, E> = Partial<{message: string, data: D , error: E, meta: null | TRequestQuery, success: boolean}>