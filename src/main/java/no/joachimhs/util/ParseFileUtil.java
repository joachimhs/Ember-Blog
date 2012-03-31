package no.joachimhs.util;

import java.io.*;

/**
 * Created by IntelliJ IDEA.
 * User: joahaa
 * Date: 3/31/12
 * Time: 12:38 PM
 * To change this template use File | Settings | File Templates.
 */
public class ParseFileUtil {

    public static String getFileContents(File inFil) {
        StringBuilder sb = new StringBuilder();

        try {
            BufferedReader inStream = new BufferedReader(new InputStreamReader(new FileInputStream(inFil)));

            String nextLine = inStream.readLine();
            while (nextLine != null) {
                sb.append(nextLine).append("\n");
                nextLine = inStream.readLine();
            }
        } catch (FileNotFoundException fne) {
            fne.printStackTrace();
        } catch (IOException ioe) {
            ioe.printStackTrace();
        }

        return sb.toString();
    }

}
