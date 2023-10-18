import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class SampleSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    // Run you query here
    await dataSource.query(``);
  }
}
