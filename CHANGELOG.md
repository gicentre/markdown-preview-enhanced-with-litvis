## 0.34.0

- Sync fork with the upstream `mume` library
- Upgrade vega to 5.21.0, vega-lite to 5.1.1, vega-embed to 6.19.1 and vega-loader to 4.4.1
- Upgrade some auxiliary dependencies and make a few small refactors

## 0.33.1

- Fix apache arrow loader

## 0.33.0

- Upgrade `vega-lite` from v4 to v5
- Change how `vega`, `vega-embed`, `vega-lite`, `vega-loader`, `loader-arrow` and `apache-arrow` are embedded.
  The versions are no longer pinned.
  To upgrade to the latest version in the curren semver major band, all you need is to reinstall the extension.

## 0.32.0

- Upgrade vega to 5.19.1
- Upgrade `immer` to 8.0.1 to mitigate [CVE-2020-28477](https://nvd.nist.gov/vuln/detail/CVE-2020-28477)

## 0.31.0

- Upgrade vega to 5.18.0, vega-embed to 6.15.0, apache-arrow to 2.0.0 and vega-loader-arrow to 0.0.9

## 0.30.0

- Upgrade vega to 5.17.0, vega-lite to 4.17.0 and vega-embed to 6.12.2

## 0.29.0

- Upgrade vega to 5.15.0 and vega-lite to 4.15.0
- Fix caching issue (<https://github.com/gicentre/litvis/issues/47>)
- Bump dependencies

## 0.28.0

- Sync this fork with the upstream project
- Upgrade vega to 5.14.0 and vega-embed to 6.11.1, fix CDN vega versions

## 0.27.0

- Upgrade vega-lite to 4.14.1 and vega-embed to 6.10.0

## 0.26.0

- Upgrade vega to 5.13.0, vega-lite to 4.13.1 and vega-embed to 6.9.0

## 0.25.0

- Upgrade vega to 5.10.1, vega-lite to 4.10.2 and vega-embed to 6.5.2

## 0.24.0

- Upgrade vega-lite to 4.8.1 and vega-embed to 6.5.1

## 0.23.0

- Upgrade vega to 5.10.0, vega-lite to 4.5.1, vega-embed to 6.3.2 and apache-arrow to 0.16.0

## 0.22.0

- Upgrade vega-lite to 4.3.1

## 0.21.0

- Upgrade vega to 5.9.1, vega-lite to 4.1.1 and vega-embed to 6.2.2

## 0.20.1

- Upgrade vega to 5.9.0, vega-lite to 4.0.0 and vega-embed to 6.2.1

## 0.20.0

- Upgrade vega-lite to 4.0.0-beta.11, fix outdated vega versions in CDN links (affects interactive mode only)

## 0.19.0

- Fix compatibility with Atom 1.41
- Update apache-arrow to 0.15.0, vega to 5.7.3, vega-lite to 4.0.0-beta.10 and vega-embed to 6.0.0

## 0.18.0

- Upgrade vega to 5.7.0, vega-lite to 4.0.0-beta.8, vega-embed to 5.1.3 and vega-loader-arrow to 0.14.1

## 0.17.0

- Sync with upstream package to resolve various issues in the latest versions of editors (<https://github.com/gicentre/markdown-preview-enhanced-with-litvis/pull/1>)

## 0.16.0

- Upgrade vega to 5.4.0 and vega-embed to 4.2.0
- Support apache-arrow files in vega specs (<https://github.com/gicentre/litvis/issues/31>)
- Fix incorrect parsing of keys in elm string representation (<https://github.com/gicentre/litvis/issues/29#issuecomment-496008915>)

## 0.15.3

- Upgrade vega to 5.3.5 and vega-lite to 3.2.1
- \[elm-string-representation] Allow any strings in keys except `" = "`

## 0.15.2

- Upgrade vega to 5.3.2, vega-lite to 3.0.2 and vega-embed to 4.0.0
- Use JSDelivr as lib CDN instead of CloudFlare

## 0.15.1

- Downgrade vega from 5.3.0 to 5.1.0 to avoid `Error: Cycle detected in dataflow graph`

## 0.15.0

- New command: _Markdown Preview Enhanced with Litvis: Clear Cache_ (useful when need to upgrade Elm dependencies or when cache is corrupt)
- Fix a number of regressions in Elm output parsing and URL fetching
- Improve error handling in a couple of edge cases
- Upgrade vega to 5.3.0

## 0.14.0

- Upgrade vega to 5.0.0, vega-lite to 3.0.0-rc14 and vega-embed to 4.0.0-rc1 ([gicentre/mume-with-litvis#11bc9651](https://github.com/gicentre/mume-with-litvis/commit/11bc96514feedadd7e125398f3fee3fc5ff3a630))

## 0.13.0

- Add ability to highlight lines of code ([gicentre/litvis#9](https://github.com/gicentre/litvis/issues/9), [shd101wyy/mume#100](https://github.com/shd101wyy/mume/pull/100), [mume-with-litvis#5074ca39](https://github.com/gicentre/mume-with-litvis/commit/5074ca39a24ff86ef8ddc63c35f33b212e2da984))

## 0.12.0

- Upgrade vega to 4.4.0, vega-lite to 3.0.0-rc10 and vega-embed to 3.26.1 ([gicentre/mume-with-litvis#429dcf63](https://github.com/gicentre/mume-with-litvis/commit/429dcf6370191cfc8b421923a6283d4f7bdc7625))

- Fix a few minor bugs ([gicentre/litvis#11](https://github.com/gicentre/litvis/issue/11),
  [gicentre/litvis#12](https://github.com/gicentre/litvis/issue/12),
  [gicentre/litvis#13](https://github.com/gicentre/litvis/issue/13),
  [gicentre/litvis#14](https://github.com/gicentre/litvis/issue/14),
  [gicentre/litvis#15](https://github.com/gicentre/litvis/issue/15),
  [gicentre/litvis#16](https://github.com/gicentre/litvis/issue/16),
  [gicentre/litvis#17](https://github.com/gicentre/litvis/issue/17))

## 0.11.0

- Implement markdown output from litvis blocks ([gicentre/litvis#10](https://github.com/gicentre/litvis/pull/10))

## 0.10.0

- **Switch to Elm 0.19**. Elm 0.18 users please use version 0.9.0 of this atom package (`apm install markdown-preview-enhanced-with-litvis@0.9.0`)
- Upgrade vega to 4.3.0, vega-lite to 3.0.0-rc6 and vega-embed to 3.20.0

## 0.9.0

- Upgrade vega to 4.2.0, Vega-Lite to 3.0.0-rc3 and vega-embed to 3.18.2

## 0.7.0

- Improve parsing of narrative schemas, support label aliases and fix rules

## 0.6.1

- Suggest installing dependencies of `linter-ui-default` too to reduce the number of clicks by user

## 0.6.0

- Use `atom-package-deps` to prompt about installing `linter-ui-default`
- Merge from upstream to use better config defaults

## 0.5.2-0.5.6

- Fix path detection for elm binaries

## 0.5.1

- Use a local copy of `elm` to avoid its setup via npm
- use an OS-specific temp directory (`echo $TMPDIR`) instead of hard-coded `/tmp/literate-elm`

## 0.5.0

- Upgrade `vega` to `3.3.1`, `vega-lite` to `2.4.0` and `vega-embed` to `3.7.2` ([shd101wyy/mume#65](https://github.com/shd101wyy/mume/pull/65)).
