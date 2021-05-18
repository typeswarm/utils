import { DefinitionsService } from '@typeswarm/cli';
import { parseService, StrictService } from '@typeswarm/cli/lib/normalize';
import immer from 'immer';

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
