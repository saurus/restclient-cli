import { RestClient } from "../controllers/RestClient";
import { HttpResponse } from "../models/httpResponse";
import { ResponseFormatUtility } from "../utils/responseFormatUtility";

export class RestClientCli extends RestClient {
    public renderResponse(response: HttpResponse) {
        const content = ResponseFormatUtility.getTextDocumentContent(response);
        console.log(content);
    }
}