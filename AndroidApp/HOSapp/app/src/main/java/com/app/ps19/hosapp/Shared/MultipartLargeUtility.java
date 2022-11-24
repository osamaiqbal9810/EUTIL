package com.app.ps19.hosapp.Shared;

import android.os.Build;
import android.util.Log;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.CookieHandler;
import java.net.CookieManager;
import java.net.CookieStore;
import java.net.HttpCookie;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Ajaz Ahmad Qureshi on 10/30/2017.
 */

public class MultipartLargeUtility {
    private static final String TAG ="MultipartLargeUtility" ;
    private final String boundary;
    private static final String LINE_FEED = "\r\n";
    private HttpURLConnection httpConn;
    private String charset;
    private OutputStream outputStream;
    private PrintWriter writer;
    private final int maxBufferSize = 4096;
    private long contentLength = 0;
    private URL url;
    private int statusCode=0;

    private List<FormField> fields;
    private List<FilePart> files;

    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    private class FormField {
        public String name;
        public String value;

        public FormField(String name, String value) {
            this.name = name;
            this.value = value;
        }
    }

    private class FilePart {
        public String fieldName;
        public File uploadFile;

        public FilePart(String fieldName, File uploadFile) {
            this.fieldName = fieldName;
            this.uploadFile = uploadFile;
        }
    }

    /**
     * This constructor initializes a new HTTP POST request with content type
     * is set to multipart/form-data
     *
     * @param requestURL
     * @param charset
     * @throws IOException
     */
    public MultipartLargeUtility(String requestURL, String charset, boolean requireCSRF)
            throws IOException {
        this.charset = charset;

        // creates a unique boundary based on time stamp
        boundary = "===" + System.currentTimeMillis() + "===";
        url = new URL(requestURL);
        fields = new ArrayList<>();
        files = new ArrayList<>();

        if (requireCSRF) {
            getCSRF();
        }
    }

    /**
     * Adds a form field to the request
     *
     * @param name  field name
     * @param value field value
     */
    public void addFormField(String name, String value)
            throws UnsupportedEncodingException {
        String fieldContent = "--" + boundary + LINE_FEED;
        fieldContent += "Content-Disposition: form-data; name=\"" + name + "\"" + LINE_FEED;
        fieldContent += "Content-Type: text/plain; charset=" + charset + LINE_FEED;
        fieldContent += LINE_FEED;
        fieldContent += value + LINE_FEED;
        contentLength += fieldContent.getBytes(charset).length;
        fields.add(new FormField(name, value));
    }

    /**
     * Adds a upload file section to the request
     *
     * @param fieldName  name attribute in <input type="file" name="..." />
     * @param uploadFile a File to be uploaded
     * @throws IOException
     */
    public void addFilePart(String fieldName, File uploadFile)
            throws IOException {
        String fileName = uploadFile.getName();

        String fieldContent = "--" + boundary + LINE_FEED;
        fieldContent += "Content-Disposition: form-data; name=\"" + fieldName
                + "\"; filename=\"" + fileName + "\"" + LINE_FEED;
        fieldContent += "Content-Type: "
                + URLConnection.guessContentTypeFromName(fileName) + LINE_FEED;
        fieldContent += "Content-Transfer-Encoding: binary" + LINE_FEED;
        fieldContent += LINE_FEED;
        // file content would go here
        fieldContent += LINE_FEED;
        contentLength += fieldContent.getBytes(charset).length;
        contentLength += uploadFile.length();
        files.add(new FilePart(fieldName, uploadFile));
    }

    /**
     * Adds a header field to the request.
     *
     * @param name  - name of the header field
     * @param value - value of the header field
     */
    //public void addHeaderField(String name, String value) {
    //    writer.append(name + ": " + value).append(LINE_FEED);
    //    writer.flush();
    //}

    /**
     * Completes the request and receives response from the server.
     *
     * @return a list of Strings as response in case the server returned
     * status OK, otherwise an exception is thrown.
     * @throws IOException
     */
    public List<String> finish() throws IOException {
        List<String> response = new ArrayList<String>();
        String content = "--" + boundary + "--" + LINE_FEED;
        contentLength += content.getBytes(charset).length;
        statusCode=0;

        if (!openConnection()) {
            return response;
        }

        writeContent();

        // checks server's status code first
        int status = httpConn.getResponseCode();
        this.statusCode=status;
        if (status == HttpURLConnection.HTTP_OK || status==HttpURLConnection.HTTP_CREATED) {
            BufferedReader reader = new BufferedReader(new InputStreamReader(
                    httpConn.getInputStream()));
            String line = null;
            while ((line = reader.readLine()) != null) {
                response.add(line);
            }
            reader.close();
            httpConn.disconnect();
        } else {
            throw new IOException("Server returned non-OK status: " + status);
        }
        return response;
    }

    private boolean getCSRF()
            throws IOException {
        /// First, need to get CSRF token from server
        /// Use GET request to get the token
        CookieManager cookieManager = new CookieManager();
        CookieHandler.setDefault(cookieManager);
        HttpURLConnection conn = null;

        conn = (HttpURLConnection) url.openConnection();

        conn.setUseCaches(false); // Don't use a Cached Copy
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Connection", "Keep-Alive");
        conn.getContent();
        conn.disconnect();

        /// parse the returned object for the CSRF token
        CookieStore cookieJar = cookieManager.getCookieStore();
        List<HttpCookie> cookies = cookieJar.getCookies();
        String csrf = null;
        for (HttpCookie cookie : cookies) {
            Log.d("cookie", "" + cookie);
            if (cookie.getName().equals("csrftoken")) {
                csrf = cookie.getValue();
                break;
            }
        }
        if (csrf == null) {
            Log.d(TAG, "Unable to get CSRF");
            return false;
        }
        Log.d(TAG, "Received cookie: " + csrf);

        addFormField("csrfmiddlewaretoken", csrf);
        return true;
    }

    private boolean openConnection()
            throws IOException {
        httpConn = (HttpURLConnection) url.openConnection();
        httpConn.setUseCaches(false);
        httpConn.setDoOutput(true);    // indicates POST method
        httpConn.setDoInput(true);
        //httpConn.setRequestProperty("Accept-Encoding", "identity");
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            httpConn.setFixedLengthStreamingMode(contentLength);
        }
        httpConn.setRequestProperty("accept-encoding","gzip, deflate");
        httpConn.setRequestProperty("Connection", "Keep-Alive");
        httpConn.setRequestProperty("Content-Type",
                "multipart/form-data; boundary=" + boundary);
        httpConn.setRequestProperty("processData","false");
        httpConn.setRequestProperty("contentType","false");
        httpConn.setRequestProperty("dataType","json");
        httpConn.setRequestProperty("Accept","*/*");
        httpConn.setRequestProperty("Authorization",Globals.appid);
        outputStream = new BufferedOutputStream(httpConn.getOutputStream());
        writer = new PrintWriter(new OutputStreamWriter(outputStream, charset),
                true);
        return true;
    }

    private void writeContent()
            throws IOException {

        for (FormField field : fields) {
            writer.append("--" + boundary).append(LINE_FEED);
            writer.append("Content-Disposition: form-data; name=\"" + field.name + "\"")
                    .append(LINE_FEED);
            writer.append("Content-Type: text/plain; charset=" + charset).append(
                    LINE_FEED);
            writer.append(LINE_FEED);
            writer.append(field.value).append(LINE_FEED);
            writer.flush();
        }

        for (FilePart filePart : files) {
            String fileName = filePart.uploadFile.getName();
            writer.append("--" + boundary).append(LINE_FEED);
            writer.append(
                    "Content-Disposition: form-data; name=\"" + filePart.fieldName
                            + "\"; filename=\"" + fileName + "\"")
                    .append(LINE_FEED);
            writer.append(
                    "Content-Type: "
                            + URLConnection.guessContentTypeFromName(fileName))
                    .append(LINE_FEED);
            writer.append("Content-Transfer-Encoding: binary").append(LINE_FEED);
            writer.append(LINE_FEED);
            writer.flush();

            FileInputStream inputStream = new FileInputStream(filePart.uploadFile);
            int bufferSize = Math.min(inputStream.available(), maxBufferSize);
            byte[] buffer = new byte[bufferSize];
            int bytesRead = -1;
            while ((bytesRead = inputStream.read(buffer, 0, bufferSize)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }
            outputStream.flush();
            inputStream.close();
            writer.append(LINE_FEED);
            writer.flush();
        }

        writer.append("--" + boundary + "--").append(LINE_FEED);
        writer.close();
    }
}