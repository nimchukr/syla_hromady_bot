import { FileService } from '../google/services/drive';

export const getFormList = async (folder: string) => {
  const fileService = new FileService();
  const drive = await fileService.listFiles({
    where: {
      type: 'form',
      parentFolder: folder,
    },
  });
  return drive?.data?.files.map(({ id, name }) => ({ id, title: name?.trim() }));
};
