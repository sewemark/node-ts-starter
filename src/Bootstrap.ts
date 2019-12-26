import { Container } from 'inversify';
import { ILogger } from './logger/ILogger';
import { Logger } from './logger/Logger';
import { Types } from './Types';

export function initContainer(): Container {
    const container = new Container();
    registerDependencies(container);
    return container;
}

function registerDependencies(container: Container): void {
    container.bind<ILogger>(Types.Logger).to(Logger);
}
