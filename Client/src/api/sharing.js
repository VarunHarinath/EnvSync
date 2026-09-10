import {client} from "./client";
export const sharingApi={teammates:()=>client("/teammates"),list:(type,id)=>client(`/shares/${type}/${id}`),share:(type,id,userId,permission)=>client(`/shares/${type}/${id}`,{body:{userId,permission}}),remove:(type,id,userId)=>client(`/shares/${type}/${id}/${userId}`,{method:"DELETE"})};
