import { RestClientSettings } from "../models/configurationSettings";
import { RestClientSettingsCli } from "./restClientSettingsCli";

RestClientSettings.Instance = new RestClientSettingsCli();

import fs from 'fs';
import { RestClient } from "../controllers/RestClient";
import { RestClientCli } from './restClientCli';
import { DocumentWrapperCli } from "./documentWrapperCli";

export class Cli {
    public static run(): void {
        let rcli: RestClient = new RestClientCli();
        for (let i = 2; i < process.argv.length; i++) {
            let fileName: string = process.argv[i];
            console.log(i + ': ' + fileName);
            (RestClientSettings.Instance as RestClientSettingsCli).setCurrentDocumentWrapper(new DocumentWrapperCli(fileName));
            let text: string = fs.readFileSync(fileName, 'utf-8');
            rcli.runText(text).then(_ => console.log("the end."));
        }
    }
}
