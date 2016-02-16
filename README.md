# Gettext Merge

Merge gettext template files with existents .po without losing the current translations

## Install

```bash
npm install gettext-merge
```

## Usage

```bash
gettext-merge --po=yourpofile.po --pot=yourpotfile.pot
```

Your .po file now have new strings and comments.
Optionally, if you don't want override the existent .po, add --output=filewithmerge.po