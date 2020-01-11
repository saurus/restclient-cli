import { DocumentWrapper } from "../utils/DocumentWrapper";
import * as path from 'path';
import fs from 'fs';

export class DocumentWrapperCli implements DocumentWrapper {
    public documentWrapperType: string;

    get version(): number {
        return 1;
    }

    get fileName(): string {
        return path.basename(this.fullPath);
    }

    getPath(): string {
        return path.dirname(this.fullPath);
    }

    getText(): string {
        return fs.readFileSync(this.fullPath, 'utf-8');
    }

    public constructor(public fullPath: string) {
        this.documentWrapperType = "cli";
    }
}
