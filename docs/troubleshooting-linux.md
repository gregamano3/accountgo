# Linux: `dotnet watch` and inotify limits

## What you see

```
System.IO.IOException: The configured user limit (128) on the number of inotify instances has been reached...
   at System.IO.FileSystemWatcher.StartRaisingEvents()
```

`dotnet watch` uses file watchers. On Linux, those rely on **inotify**. The default per-user cap (often **128** instances) is easy to hit when several tools (IDE, other `dotnet watch` sessions, Node, etc.) are running.

## Fix 1: Raise inotify limits (recommended on Fedora / Linux)

Check current values:

```bash
cat /proc/sys/fs/inotify/max_user_instances
cat /proc/sys/fs/inotify/max_user_watches
```

Apply until reboot:

```bash
sudo sysctl fs.inotify.max_user_instances=512
sudo sysctl fs.inotify.max_user_watches=524288
```

Make it persistent (Fedora uses `/etc/sysctl.d/`):

```bash
sudo tee /etc/sysctl.d/99-accountgo-inotify.conf <<'EOF'
fs.inotify.max_user_instances = 512
fs.inotify.max_user_watches = 524288
EOF
sudo sysctl --system
```

Then restart your terminal (or log out/in) and try `dotnet watch` again.

## Fix 2: Use polling instead of inotify (no sysctl change)

Polling uses more CPU but avoids inotify limits. For a single API project:

```bash
export DOTNET_USE_POLLING_FILE_WATCHER=1
dotnet watch --project src/Api/Api.csproj
```

(Add the `export` line to your shell profile if you want it always on for dev.)

## Fix 3: Run without watch (no hot reload)

If you do not need file-change reload:

```bash
dotnet run --project src/Api/Api.csproj
```

Use your IDE’s debugger or rebuild manually after edits.

## Related: EF “MultipleCollectionInclude” warning

That message is a performance hint from Entity Framework, not a crash. You can tune `QuerySplittingBehavior` globally in `DbContext` configuration if queries become slow; it is unrelated to inotify.
