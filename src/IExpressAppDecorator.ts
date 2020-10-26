import { Express } from 'express';
import * as http from 'http';

export interface IExpressAppDecorator {
    decorate(app: Express ): void;
}
