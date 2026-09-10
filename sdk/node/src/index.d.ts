export interface EnvSyncConfig { apiKey:string;baseUrl:string;timeout?:number;cacheTtl?:number;fetch?:typeof globalThis.fetch }
export declare class EnvSyncError extends Error { code:string;status?:number }
export declare class AuthenticationError extends EnvSyncError {} export declare class PermissionError extends EnvSyncError {} export declare class SecretNotFoundError extends EnvSyncError {} export declare class NetworkError extends EnvSyncError {} export declare class ServerError extends EnvSyncError {}
export declare class EnvSync { constructor(config:EnvSyncConfig);get(name:string):Promise<string>;getMany(names:string[]):Promise<Record<string,string>>;getAll():Promise<Record<string,string>>;health():Promise<boolean>;reload(name?:string):void }
