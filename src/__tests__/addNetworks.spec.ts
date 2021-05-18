import { StrictSpecification } from '@typeswarm/cli/lib/normalize';
import { addNetworks } from '../addNetworks';

describe('addNetworks', () => {
    it('should add networks', () => {
        const spec: StrictSpecification = {
            services: {
                one: {
                    image: 'foo',
                },
                two: {
                    image: 'bar',
                },
            },
        };

        const specWithDefaultNetwork = addNetworks(
            spec,
            ['default'],
            ['one', 'two']
        );

        const specWithProxyNetwork = addNetworks(
            specWithDefaultNetwork,
            ['proxy'],
            ['two'],
            {
                external: true,
            }
        );

        expect(specWithDefaultNetwork).toMatchInlineSnapshot(`
            Object {
              "networks": Object {
                "default": Object {
                  "external": false,
                },
              },
              "services": Object {
                "one": Object {
                  "image": "foo",
                  "networks": Object {
                    "default": null,
                  },
                },
                "two": Object {
                  "image": "bar",
                  "networks": Object {
                    "default": null,
                  },
                },
              },
            }
        `);
        expect(specWithProxyNetwork).toMatchInlineSnapshot(`
            Object {
              "networks": Object {
                "default": Object {
                  "external": false,
                },
                "proxy": Object {
                  "external": true,
                },
              },
              "services": Object {
                "one": Object {
                  "image": "foo",
                  "networks": Object {
                    "default": null,
                  },
                },
                "two": Object {
                  "image": "bar",
                  "networks": Object {
                    "default": null,
                    "proxy": null,
                  },
                },
              },
            }
        `);
    });
});
