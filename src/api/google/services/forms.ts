import { forms_v1 } from 'googleapis';
import { getGoogleFormsClient } from '../clients';

export class FormsService {
  private readonly client = getGoogleFormsClient();
  private readonly service: forms_v1.Resource$Forms;
  constructor() {
    this.service = this.client.forms;
  }

  async getForm(id: string) {
    return this.service.get({ formId: id });
  }
}
