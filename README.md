# Java SpotBugs Annotations Uploader

Uploads Spotbugs errors & warnings as [GitHub Annotations](https://docs.github.com/en/rest/reference/checks#list-check-run-annotations)
and decorates the log file output. Unlike other similar Actions, this also works on pull requests from forks and Dependabot.

## Usage

```yaml
steps:
 - uses: miurahr/spotbugs-annotations-action@v1

 # Execute SpotBugs
```

Console output for SpotBugs must be enabled. For example, this
Action will not work if the output is only written to an XML file.

## Advanced

No special permissions are required to upload annotations from
forks, as a [Problem Matcher](https://github.com/actions/toolkit/blob/master/docs/problem-matchers.md)
is used. This scans the output of steps for a [specified regular expression](https://github.com/kiancross/checkstyle-annotations-action/blob/master/problem-matcher.json),
which matches Checkstyle's logging format.

## License

The contents of this repository is released under the [MIT License](https://github.com/miurahr/spotbugs-annotations-action/blob/master/LICENSE).
