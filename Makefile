PROJECTNAME="Poloniex USD and JPY View"

all: prelogue clean build archive epilogue

prelogue:
	@echo ""
	@echo ">>> $(PROJECTNAME) build started"
	@echo ""

clean: ./app/content_script.js ./app/background.js
	@rm -rf ./app/content_script.js ./app/background.js

build: src
	@npm run build
	@npm run minify

archive: ./app/content_script.js ./app/background.js
	@zip archive.zip -r ./app

epilogue:
	@echo ""
	@echo ">>> $(PROJECTNAME) build has successfully finished"
	@echo ""

.PHONY: prelogue build archive epilogue
