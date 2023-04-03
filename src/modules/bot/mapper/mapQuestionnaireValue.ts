import { mapFieldValueToEntryParam } from '../../google/form/mappers';
import { QuestionnaireValue } from '../types/questionnaire';

export const mapQuestionnaireValues = (questionnaireState: Record<string, QuestionnaireValue>) => {
  return Object.entries(questionnaireState).reduce((results, [id, value]) => {
    if (typeof value === 'string') {
      const entry = mapFieldValueToEntryParam({ id, value });
      results.push(entry);
      return results;
    }

    if (value.selectedValues.length) {
      results = results.concat(value.selectedValues.map(selectedValue => mapFieldValueToEntryParam({ id, value: selectedValue })));
    }
    if (value.otherValue) {
      results.push(
        mapFieldValueToEntryParam({ id, value: '__other_option__' }),
        mapFieldValueToEntryParam({ id: `${id}.other_option_response`, value: value.otherValue }),
      );
    }
    return results;
  }, [] as string[]);
};
