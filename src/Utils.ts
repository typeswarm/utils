import immer from 'immer';
import {
    StrictService,
    parseService,
    StrictPortMapping,
} from '@typeswarm/cli/lib/normalize';
import { DefinitionsService } from '@typeswarm/cli';

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

export const unpublishPort = (target: number) => (
    service: DefinitionsService
): StrictService => {
    return immer(parseService(service), (service: StrictService) => {
        service.ports = (service.ports ?? []).filter(
            (port) => port.target !== target
        );
    });
};

export const setImageTag = (options: { image?: string; tag?: string }) => (
    service: DefinitionsService
): StrictService => {
    return immer(parseService(service), (service: StrictService) => {
        const [image, tag] = (service.image ?? '').split(':', 2);
        const imageTag = { image, tag, ...options };
        if (!imageTag.image) {
            throw new Error(
                `Image is missing. Service: ${JSON.stringify(service)}`
            );
        }
        service.image = imageTag.image;
        if (imageTag.tag) {
            service.image = service.image + ':' + imageTag.tag;
        }
    });
};
