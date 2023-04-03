const operators = {
  contains: 'contains',
  equals: '=',
  greaterThan: '>',
  greaterThanOrEqual: '>=',
  in: 'in',
  lessThan: '<',
  lessThanOrEqual: '<=',
  notEquals: '!=',
} as const;

type TypeFilterTypes = Extract<keyof typeof operators, 'equals' | 'notEquals'>;

const GOOGLE_TYPES_PREFIX = 'application/vnd.google-apps';
const GOOGLE_TYPES = ['form', 'folder', 'document', 'file'] as const;
const TYPE_PROPERTY = 'mimeType';

export class QueryBuilder {
  private query: string;
  private queries: string[];
  constructor() {
    this.queries = [];
    this.query = '';
  }

  private addQuery(query: string) {
    this.queries.push(query);
  }

  private addIncludes(value: string, property: string) {
    const operator = operators.in;
    this.addQuery(`${property} ${operator} '${value}'`);
  }

  public addType(type: string, operator: TypeFilterTypes = 'equals', options: { isCustom?: boolean } = {}) {
    const { isCustom } = options;
    let query = `${TYPE_PROPERTY} ${operators[operator]}`;
    if (isCustom) {
      query += ` '${type}'`;
    } else {
      if (!GOOGLE_TYPES.includes(type as (typeof GOOGLE_TYPES)[number])) {
        throw new Error('Invalid Google Drive type');
      }
      query += ` '${GOOGLE_TYPES_PREFIX}.${type}'`;
    }
    this.addQuery(query);
  }

  public addParent(parent: string) {
    this.addIncludes(parent, 'parents');
  }

  public build() {
    return this.queries.join(' and ');
  }
}
