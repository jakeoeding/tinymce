import { FieldSchema, FieldProcessorAdt } from '@ephox/boulder';
import { SketchBehaviours } from '../api/component/SketchBehaviours';

import { Sandboxing } from '../api/behaviour/Sandboxing';
import { Receiving } from '../api/behaviour/Receiving';
import { Composing } from '../api/behaviour/Composing';

// TODO: Roll this back into Fields at some point
// Unfortunately there appears to be a cyclical dependency or something that's preventing it, but for now this will do as it's home
const sandboxFields = (): FieldProcessorAdt[] => {
  return [
    FieldSchema.defaulted('sandboxClasses', [ ]),
    SketchBehaviours.field('sandboxBehaviours', [ Composing, Receiving, Sandboxing ])
  ];
};

export {
  sandboxFields
};
