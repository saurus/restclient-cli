
import filesize from 'filesize';
import { RequestStatusEntry, RequestStaus, RequestState } from '../utils/requestStatusEntry';

export class RequestStatusEntryCli implements RequestStatusEntry {
    public dispose(): void {
    }

    public update(status: RequestStaus) {
        switch (status.state) {
            case RequestState.Closed:
                console.log("   Closed.");
                break;
            case RequestState.Error:
                console.log("   Error!");
                break;
            case RequestState.Pending:
                console.log("   Waiting...");
                break;
            case RequestState.Cancelled:
                console.log("   Cancelled");
                break;
            case RequestState.Received:
                const response = status.response;
                console.log(`   Duration: ${response.timingPhases.total}ms`);
                console.log('      Breakdown of Duration:');
                console.log(`      Socket: ${response.timingPhases.wait.toFixed(1)}ms`);
                console.log(`      DNS: ${response.timingPhases.dns.toFixed(1)}ms`);
                console.log(`      TCP: ${response.timingPhases.tcp.toFixed(1)}ms`);
                console.log(`      Request: ${response.timingPhases.request.toFixed(1)}ms`);
                console.log(`      FirstByte: ${response.timingPhases.firstByte.toFixed(1)}ms`);
                console.log(`      Download: ${response.timingPhases.download.toFixed(1)}ms`);
                console.log(`   Size:  ${filesize(response.bodySizeInBytes + response.headersSizeInBytes)}`);
                console.log('      Breakdown of Response Size:');
                console.log(`      Headers: ${filesize(response.headersSizeInBytes)}`);
                console.log(`      Body: ${filesize(response.bodySizeInBytes)}`);
                break;
        }
    }
}
