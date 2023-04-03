import { drive_v3 } from 'googleapis';
import { getGoogleDriveClient } from '../clients';
import { QueryBuilder } from '../helpers/QueryBuilder';

export class FileService {
  private readonly client = getGoogleDriveClient();
  private readonly service: drive_v3.Resource$Files;
  constructor() {
    this.service = this.client.files;
  }

  async listFiles({ where }: { where: { type: string; parentFolder: string } }) {
    let q = '';
    if (where) {
      const query = new QueryBuilder();
      if (where.type) {
        query.addType(where.type, 'equals');
      }
      if (where.parentFolder) {
        query.addParent(where.parentFolder);
      }
      q = query.build();
    }
    return this.service.list({ q });
  }
}
