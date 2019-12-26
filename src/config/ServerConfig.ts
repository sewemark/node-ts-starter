import { ILogger } from '../logger/ILogger';

export class ServerConfig {
    private _port: number = 8080;
    private _databaseConnectionString: string = 'connectionstring';
    private logger: ILogger;

    public get port(): number {
        return this._port;
    }

    public get databaseConnectionString(): string {
        return this._databaseConnectionString;
    }

    constructor(logger: ILogger) {
        this.logger = logger;
    }

    public serialize(): any {
        return {
            port: this.port,
            databaseConnectionString: this.databaseConnectionString,
        };
    }

    public deserialize(config: any): void {
        if (config.port && Number.isInteger(config.port) && Number(config.port) < Number.MAX_SAFE_INTEGER) {
            this._port = config.port;
        } else {
            this.logger.info(
                'ServerConfig',
                'deserialize',
                `Invalid port value ${config.port}, using default value ${this.port}`,
            );
        }

        if (config.databaseConnectionString && typeof config.databaseConnectionString === 'string') {
            this._databaseConnectionString = config.databaseConnectionString;
        } else {
            this.logger.info(
                'ServerConfig',
                'deserialize',
                `Invalid connection string value ${config.databaseConnectionString},
                 using default value ${this.databaseConnectionString}`,
            );
        }
    }
}
