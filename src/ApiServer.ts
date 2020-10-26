import * as bodyParser from 'body-parser';
import { Express, Request, Response } from 'express';
import { ServerConfig } from './config/ServerConfig';
import { ILogger } from './logger/ILogger';
import { IExpressAppDecorator } from './IExpressAppDecorator';
const { createTerminus } = require('@godaddy/terminus')

const cors = require('cors');

export class ApiServer {
    private logger: ILogger;
    private app: Express;
    private serverConfig: ServerConfig;
    private appDecorators: IExpressAppDecorator[];

    constructor(
        logger: ILogger,
        serverConfig: ServerConfig,
        app: Express,
        appDecorators: IExpressAppDecorator[],
    ) {
        this.logger = logger;
        this.serverConfig = serverConfig;
        this.app = app;
        this.appDecorators = appDecorators;
    }

    public start() {
        this.registerMiddlewares();
        this.registerRoutes();
        this.registerDecorators();
    }

    private registerMiddlewares(): void {
        this.app.use(bodyParser.json());
        this.app.use(cors());
    }

    private registerRoutes(): void {
        this.logger.info('ApiServer', 'registerRoutes', 'Registering routes...');
        this.app.get('/healthcheck', (req: Request, res: Response, next: Function) => {
            res.status(200).send('Ok2');
        });
        this.app.get('/readiness', (req: Request, res: Response, next: Function) => {
            res.status(200).send('Ok2');
        });
        this.app.get('/liveness', (req: Request, res: Response, next: Function) => {
            res.status(200).send('Ok');
        });
        this.app.use((err: any, req: Request, res: Response, next: any) =>
            res.status(422).send({ error: err.message }));
    }

    private registerDecorators() {
        this.appDecorators.forEach((appDecorator: IExpressAppDecorator) => {
            appDecorator.decorate(this.app);
        });
    }
}
