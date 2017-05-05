package sampleHandlers_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"bitbucket.org/dkfbasel/scratch/src/backend/environment"
	"bitbucket.org/dkfbasel/scratch/src/backend/repository"
	"bitbucket.org/dkfbasel/scratch/src/backend/sampleHandlers"

	"github.com/labstack/echo"
	. "github.com/smartystreets/goconvey/convey"
)

type mockDB struct{}

// Get ..
func (*mockDB) Get(sampleID string) string {
	return "my-sample-value"
}

// Set ..
func (*mockDB) Set(sampleID, value string) error {
	return nil
}

func TestSampleHandlers(t *testing.T) {

	env := environment.Spec{}

	// env.SampleDB = &mockDB{}
	env.SampleDB, _ = repository.NewSampleDB()
	env.SampleDB.Set("sampleid", "my-sample-value") // nolint: errcheck

	Convey("Given a running server", t, func() {

		Convey("Get sample should return the specified sample", func() {

			router := echo.New()
			request := new(http.Request)
			recorder := httptest.NewRecorder()
			ctx := router.NewContext(request, recorder)

			ctx.SetParamNames("id")
			ctx.SetParamValues("sampleid")
			handler := sampleHandlers.GetSample(env)
			err := handler(ctx)

			So(err, ShouldBeNil)
			So(recorder.Body.String(), ShouldEqual, "my-sample-value")

		})

		Convey("Set sample should set a sample value", func() {

			router := echo.New()
			request := new(http.Request)
			recorder := httptest.NewRecorder()

			ctx := router.NewContext(request, recorder)
			ctx.SetParamNames("id")
			ctx.SetParamValues("no-exist")

			getHandler := sampleHandlers.GetSample(env)
			err := getHandler(ctx)
			So(err, ShouldBeNil)
			So(recorder.Body.String(), ShouldBeEmpty)

			ctx = router.NewContext(request, recorder)
			ctx.SetParamNames("id", "value")
			ctx.SetParamValues("no-exist", "now I exist")
			setHandler := sampleHandlers.SetSample(env)
			err = setHandler(ctx)
			So(err, ShouldBeNil)

			recorder2 := httptest.NewRecorder()
			ctx = router.NewContext(request, recorder2)
			ctx.SetParamNames("id")
			ctx.SetParamValues("no-exist")
			err = getHandler(ctx)
			So(err, ShouldBeNil)
			So(recorder2.Body.String(), ShouldEqual, "now I exist")

		})

	})
}
