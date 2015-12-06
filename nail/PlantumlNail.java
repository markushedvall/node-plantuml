import java.lang.InterruptedException;
import java.io.IOException;
import java.io.File;

import com.martiansoftware.nailgun.NGConstants;
import com.martiansoftware.nailgun.NGContext;
import net.sourceforge.plantuml.FileSystem;
import net.sourceforge.plantuml.Run;

public class PlantumlNail {
  public static void nailMain(NGContext context) throws IOException, InterruptedException {
    boolean decode = false;
    for (String arg : context.getArgs()) {
      if (arg.equals("-decodeurl")) {
        decode = true;
        break;
      }
    }

    if (!decode) {
      synchronized (PlantumlNail.class) {
        File cwd = new File(context.getWorkingDirectory());
        FileSystem.getInstance().setCurrentDir(cwd);
        Run.main(context.getArgs());
      }
    } else {
      // Don't synchronize when decoding
      Run.main(context.getArgs());
    }

    context.exit(0);
  }
}
