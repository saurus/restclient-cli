import { RestClientSettings } from '../models/configurationSettings';
import { DocumentWrapper } from '../utils/DocumentWrapper';
import { MyEventEmitter } from '../utils/myEventEmitter';
import { RequestStatusEntry } from '../utils/requestStatusEntry';
import { EventEmitterCli } from './eventEmitterCli';
import { RequestHeaders } from '../models/base';
import { HostCertificate } from '../models/hostCertificate';
import { FormParamEncodingStrategy, fromString as ParseFormParamEncodingStr } from '../models/formParamEncodingStrategy';
import { fromString as ParseLogLevelStr, LogLevel } from '../models/logLevel';
import { fromString as ParsePreviewOptionStr, PreviewOption } from '../models/previewOption';
import { RequestStatusEntryCli } from './requestStatusEntryCli';
import { EnvironmentVariableProvider } from '../utils/httpVariableProviders/environmentVariableProvider';

export interface WorkspaceConfiguration {
    /**
     * Return a value from this configuration.
     *
     * @param section Configuration name, supports _dotted_ names.
     * @param defaultValue A value should be returned when no value could be found, is `undefined`.
     * @return The value `section` denotes or the default.
     */
    get<T>(section: string, defaultValue: T): T;
}

export class CmdLineConfiguration implements WorkspaceConfiguration {
    public get<T>(section: string, defaultValue: T): T {
        return defaultValue;
    }
}


export class ISMap<V> {
    [key: string]: V;
}


export class RestClientSettingsCli implements RestClientSettings {
    public followRedirect: boolean;
    public defaultHeaders: RequestHeaders;
    public timeoutInMilliseconds: number;
    public showResponseInDifferentTab: boolean;
    public requestNameAsResponseTabTitle: boolean;
    public proxy?: string;
    public proxyStrictSSL: boolean;
    public rememberCookiesForSubsequentRequests: boolean;
    public enableTelemetry: boolean;
    public excludeHostsForProxy: string[];
    public fontSize?: number;
    public fontFamily?: string;
    public fontWeight?: string;
    public environmentVariables: object; // Map<string, Map<string, string>>;
    public mimeAndFileExtensionMapping: Map<string, string>;
    public previewResponseInUntitledDocument: boolean;
    public hostCertificates: Map<string, HostCertificate>;
    public suppressResponseBodyContentTypeValidationWarning: boolean;
    public previewOption: PreviewOption;
    public disableHighlightResonseBodyForLargeResponse: boolean;
    public disableAddingHrefLinkForLargeResponse: boolean;
    public largeResponseBodySizeLimitInMB: number;
    // public previewColumn: ViewColumn;
    public previewResponsePanelTakeFocus: boolean;
    public formParamEncodingStrategy: FormParamEncodingStrategy;
    public addRequestBodyLineIndentationAroundBrackets: boolean;
    public decodeEscapedUnicodeCharacters: boolean;
    public logLevel: LogLevel;
    public enableSendRequestCodeLens: boolean;
    public enableCustomVariableReferencesCodeLens: boolean;

    private currentDocumentWrapper: DocumentWrapper;

    public setCurrentDocumentWrapper(documentWrapper: DocumentWrapper): void {
        this.currentDocumentWrapper = documentWrapper;
    }

    getRootPath(): string | undefined {
        return process.cwd();
    }
    showWarningMessage(message: string): void {
        console.warn(message);
    }
    showErrorMessage(message: string): void {
        console.error(message);
    }
    getCurrentHttpFileName(): string | undefined {
        return this.currentDocumentWrapper.fileName;
    }
    getCurrentDocumentWrapper(): DocumentWrapper | undefined {
        return this.currentDocumentWrapper;
    }
    getEmitter<T>(): MyEventEmitter<T> {
        return new EventEmitterCli();
    }
    getRequestStatusEntry(): RequestStatusEntry {
        return new RequestStatusEntryCli();
    }
    public getRootFsPath(): string | undefined {
        return process.cwd();
    }

    public constructor() {
        this.initializeSettings();
    }

    private initializeSettings() {
        const restClientSettings = new CmdLineConfiguration();
        this.followRedirect = restClientSettings.get<boolean>("followredirect", true);
        this.defaultHeaders = restClientSettings.get<RequestHeaders>("defaultHeaders",
            {
                "User-Agent": "vscode-restclient"
            });
        this.showResponseInDifferentTab = restClientSettings.get<boolean>("showResponseInDifferentTab", false);
        this.requestNameAsResponseTabTitle = restClientSettings.get<boolean>("requestNameAsResponseTabTitle", false);
        this.rememberCookiesForSubsequentRequests = restClientSettings.get<boolean>("rememberCookiesForSubsequentRequests", true);
        this.timeoutInMilliseconds = restClientSettings.get<number>("timeoutinmilliseconds", 0);
        if (this.timeoutInMilliseconds < 0) {
            this.timeoutInMilliseconds = 0;
        }
        this.excludeHostsForProxy = restClientSettings.get<string[]>("excludeHostsForProxy", []);
        // this.fontSize = restClientSettings.get<number>("fontSize");
        // this.fontFamily = restClientSettings.get<string>("fontFamily");
        // this.fontWeight = restClientSettings.get<string>("fontWeight");

        this.environmentVariables = new ISMap<Map<string, string>>();
        this.environmentVariables[EnvironmentVariableProvider.sharedEnvironmentName] = new Map<string, string>();
        // this.environmentVariables = new Map<string, Map<string, string>>();
        // this.environmentVariables.set(EnvironmentVariableProvider.sharedEnvironmentName, new Map<string, string>());
        // this.environmentVariables = restClientSettings.get<Map<string, Map<string, string>>>("environmentVariables", new Map<string, Map<string, string>>());
        this.mimeAndFileExtensionMapping = restClientSettings.get<Map<string, string>>("mimeAndFileExtensionMapping", new Map<string, string>());

        this.previewResponseInUntitledDocument = restClientSettings.get<boolean>("previewResponseInUntitledDocument", false);
        this.previewResponsePanelTakeFocus = restClientSettings.get<boolean>("previewResponsePanelTakeFocus", true);
        this.hostCertificates = restClientSettings.get<Map<string, HostCertificate>>("certificates", new Map<string, HostCertificate>());
        this.disableHighlightResonseBodyForLargeResponse = restClientSettings.get<boolean>("disableHighlightResonseBodyForLargeResponse", true);
        this.disableAddingHrefLinkForLargeResponse = restClientSettings.get<boolean>("disableAddingHrefLinkForLargeResponse", true);
        this.largeResponseBodySizeLimitInMB = restClientSettings.get<number>("largeResponseBodySizeLimitInMB", 5);
        this.previewOption = ParsePreviewOptionStr(restClientSettings.get<string>("previewOption", "full"));
        this.formParamEncodingStrategy = ParseFormParamEncodingStr(restClientSettings.get<string>("formParamEncodingStrategy", "automatic"));
        this.enableTelemetry = restClientSettings.get<boolean>('enableTelemetry', true);
        this.addRequestBodyLineIndentationAroundBrackets = restClientSettings.get<boolean>('addRequestBodyLineIndentationAroundBrackets', true);
        this.decodeEscapedUnicodeCharacters = restClientSettings.get<boolean>('decodeEscapedUnicodeCharacters', false);
        this.logLevel = ParseLogLevelStr(restClientSettings.get<string>('logLevel', 'error'));
        this.enableSendRequestCodeLens = restClientSettings.get<boolean>('enableSendRequestCodeLens', true);
        this.enableCustomVariableReferencesCodeLens = restClientSettings.get<boolean>('enableCustomVariableReferencesCodeLens', true);

        const httpSettings = restClientSettings; // workspace.getConfiguration("http");
        this.proxy = httpSettings.get<string>('proxy', "");
        this.proxyStrictSSL = httpSettings.get<boolean>('proxyStrictSSL', false);
    }
}
