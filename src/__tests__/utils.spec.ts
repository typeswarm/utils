import { wrapService } from '@typeswarm/cli';
import { publishPort, unpublishPort, setImageTag } from '..';

describe('Utils', () => {
    describe('publishPort', () => {
        it('should publish port', () => {
            const srv = wrapService({
                image: 'foo',
            })
                .with(publishPort({ published: 8080, target: 80 }))
                .with(publishPort({ published: 8081, target: 81 }))
                .value();

            expect(srv).toEqual({
                image: 'foo',
                ports: [
                    {
                        published: 8080,
                        target: 80,
                    },
                    {
                        published: 8081,
                        target: 81,
                    },
                ],
            });
        });
    });

    describe('unpublishPort', () => {
        it('should unpublish port', () => {
            const srv = wrapService({
                image: 'foo',
                ports: [
                    {
                        published: 8080,
                        target: 80,
                    },
                    {
                        published: 8081,
                        target: 81,
                    },
                ],
            })
                .with(unpublishPort(80))
                .value();

            expect(srv).toEqual({
                image: 'foo',
                ports: [
                    {
                        published: 8081,
                        target: 81,
                    },
                ],
            });
        });
    });

    describe('setImageTag', () => {
        it('should set image and/or tag', () => {
            expect(
                wrapService({ image: 'foo' })
                    .with(setImageTag({ image: 'wordpress' }))
                    .value()
            ).toEqual({
                image: 'wordpress',
            });

            expect(
                wrapService({ image: 'foo' })
                    .with(setImageTag({ tag: 'stable' }))
                    .value()
            ).toEqual({
                image: 'foo:stable',
            });

            expect(
                wrapService({})
                    .with(setImageTag({ image: 'foo', tag: 'stable' }))
                    .value()
            ).toEqual({
                image: 'foo:stable',
            });

            expect(() =>
                wrapService({})
                    .with(setImageTag({ tag: 'stable' }))
                    .value()
            ).toThrowError('Image is missing. Service: {}');
        });
    });
});
