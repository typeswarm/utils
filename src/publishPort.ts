import { DefinitionsService } from '@typeswarm/cli';
import {
    parseService,
    StrictPortMapping,
    StrictService,
} from '@typeswarm/cli/lib/normalize';
import immer from 'immer';

export const publishPort = (portMapping: StrictPortMapping) => (
    service: DefinitionsService
): StrictService => {
    return immer(parseService(service), (service: StrictService) => {
        if (!service.ports) {
            service.ports = [];
        }
        const targetIndex = service.ports.findIndex((port) => {
            port.target === portMapping.target;
        });
        if (targetIndex >= 0) {
            throw new Error(
                `Cannot publish port ${JSON.stringify(
                    portMapping
                )}. Already published as ${JSON.stringify(
                    service.ports[targetIndex]
                )}`
            );
        }
        const publishedIndex = service.ports.findIndex((port) => {
            port.published !== undefined &&
                port.published === portMapping.published;
        });
        if (publishedIndex >= 0) {
            throw new Error(
                `Cannot publish port ${JSON.stringify(
                    portMapping
                )}. Already published as ${JSON.stringify(
                    service.ports[publishedIndex]
                )}`
            );
        }

        service.ports.push(portMapping);
    });
};
