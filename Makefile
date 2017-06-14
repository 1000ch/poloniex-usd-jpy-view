PROJECTNAME="Poloniex Yen View"

all: prelogue build archive epilogue

prelogue:
	@echo ""
	@echo ">>> $(PROJECTNAME) build started"
	@echo ""

build: src
	@npm run build

archive: ./app/script.js
	@zip pyv.zip -r ./app

epilogue:
	@echo ""
	@echo ">>> $(PROJECTNAME) build has successfully finished"
	@echo ""

.PHONY: prelogue build archive epilogue
