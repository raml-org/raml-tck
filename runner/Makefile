ROOT_DIR:=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))
REPORTER_DIR:=$(ROOT_DIR)/html-reporter
REPORTS_JSON:=$(ROOT_DIR)/reports/json
JS_RUNNER_DIR:=$(ROOT_DIR)/js
PY_RUNNER_DIR:=$(ROOT_DIR)/py
RB_RUNNER_DIR:=$(ROOT_DIR)/rb
GO_RUNNER_DIR:=$(ROOT_DIR)/go
JAVA_RUNNER_DIR:=$(ROOT_DIR)/java

GO_PROJECT_NAME:=raml-tck-runner-go
export GOPATH=$(HOME)/raml-tck-go-projects
export GOBIN=$(HOME)/raml-tck-go-projects/bin
GO_PROJECT_DIR:=$(GOPATH)/src/github.com/raml-org/$(GO_PROJECT_NAME)

PY_ENV:=venv
VENV_VERSION:=16.2.0

.ONESHELL:
all: clean install report generate-html

all-js:	install-html-reporter \
		install-js \
		report-js \
		generate-html

all-py:	install-html-reporter \
		install-py \
		report-py \
		generate-html

all-rb:	install-html-reporter \
		install-rb \
		report-rb \
		generate-html

all-go:	install-html-reporter \
		install-go \
		report-go \
		generate-html

all-java: install-html-reporter \
		install-java \
		report-java \
		generate-html

install: install-html-reporter \
		install-js \
		install-py \
		install-rb \
		install-go \
		install-java

install-html-reporter:
	cd $(REPORTER_DIR)
	npm install .

install-js: clean-js
	cd $(JS_RUNNER_DIR)
	npm install .

create-virtualenv:
	cd $(PY_RUNNER_DIR)
	mkdir $(PY_ENV)
	cd $(PY_ENV)
	curl -sL https://github.com/pypa/virtualenv/archive/$(VENV_VERSION).tar.gz | tar xz
	python virtualenv-$(VENV_VERSION)/virtualenv.py .

install-py: clean-py create-virtualenv
	cd $(PY_RUNNER_DIR)
	. $(PY_ENV)/bin/activate
	pip install -r requirements.txt
	# Install with -e so path to reports is resolved properly
	pip install -e .

install-rb:
	cd $(RB_RUNNER_DIR)
	sudo gem install bundler
	bundle install

install-go:
	mkdir -p ${GOPATH}/src
	mkdir -p ${GOPATH}/bin
	mkdir -p ${GOPATH}/pkg
	mkdir -p $(GO_PROJECT_DIR)
	cp $(GO_RUNNER_DIR)/* $(GO_PROJECT_DIR)
	cd $(GO_PROJECT_DIR)
	go get
	go install

install-java:
	cd $(JAVA_RUNNER_DIR)
	./gradlew build

report: report-js \
		report-py \
		report-rb \
		report-go \
		report-java

report-js:
	cd $(JS_RUNNER_DIR)
	node src/index.js --parser raml-1-parser --outdir $(REPORTS_JSON)
	node src/index.js --parser amf-client-js --outdir $(REPORTS_JSON)
	node src/index.js --parser webapi-parser --outdir $(REPORTS_JSON)

report-py:
	cd $(PY_RUNNER_DIR)
	. $(PY_ENV)/bin/activate
	raml-test-py --parser ramlfications --outdir $(REPORTS_JSON)
	raml-test-py --parser pyraml-parser --outdir $(REPORTS_JSON)

report-rb:
	cd $(RB_RUNNER_DIR)
	ruby main.rb --parser brujula --outdir $(REPORTS_JSON)
	ruby main.rb --parser raml-rb --outdir $(REPORTS_JSON)

report-go:
	$(GOBIN)/$(GO_PROJECT_NAME) -parser jumpscale -outdir $(REPORTS_JSON)
	$(GOBIN)/$(GO_PROJECT_NAME) -parser go-raml -outdir $(REPORTS_JSON)

report-java:
	cd $(JAVA_RUNNER_DIR)
	./gradlew run --args='--parser webapi-parser --outdir $(REPORTS_JSON)'
	./gradlew run --args='--parser raml-java-parser --outdir $(REPORTS_JSON)'

generate-html:
	cd $(REPORTER_DIR)
ifdef tck_branch
	node src/index.js $(tck_branch)
else
	node src/index.js master
endif

clean: clean-js clean-py clean-go
	rm -f $(REPORTS_JSON)/*
	rm -f $(ROOT_DIR)/reports/html/*.html

clean-js:
	rm -rf $(JS_RUNNER_DIR)/node_modules

clean-py:
	rm -rf $(PY_RUNNER_DIR)/$(PY_ENV)

clean-go:
	rm -rf $(GOPATH)
