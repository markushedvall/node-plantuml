import java.lang.InterruptedException;
import java.io.IOException;
import java.io.File;

import com.martiansoftware.nailgun.NGConstants;
import com.martiansoftware.nailgun.NGContext;
import net.sourceforge.plantuml.FileSystem;
import net.sourceforge.plantuml.Run;

public class PlantumlNail {
  public static void nailMain(NGContext context) throws IOException, InterruptedException {
    synchronized (PlantumlNail.class) {
      File cwd = new File(context.getWorkingDirectory());
      FileSystem.getInstance().setCurrentDir(cwd);
      Run.main(context.getArgs());
      context.exit(0);
    }
  }
}
