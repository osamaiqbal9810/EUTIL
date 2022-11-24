package com.app.ps19.scimapp;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;

import com.app.ps19.scimapp.Shared.Globals;
import com.github.barteksc.pdfviewer.PDFView;
import com.github.barteksc.pdfviewer.util.FitPolicy;

import java.io.File;

import static com.app.ps19.scimapp.Shared.Globals.setLocale;

public class PdfActivity extends AppCompatActivity {
    PDFView pdfView;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setLocale(this);
        setContentView(R.layout.activity_pdf);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        String[] title = Globals.selectedPdf.getName().split("\\.");
        setTitle(title[0]);
        pdfView = (PDFView) findViewById(R.id.pdfView);
        openFile(Globals.selectedPdf);
    }
    private void openFile(File file){
        pdfView.fromFile(file) // all pages are displayed by default
                .enableSwipe(true)
                .enableDoubletap(true)
                .swipeHorizontal(false)
                .defaultPage(1)
                .enableAnnotationRendering(false)
                .password(null)
                .enableAntialiasing(true)
                .spacing(0)
                .autoSpacing(true) // add dynamic spacing to fit each page on its own on the screen
                .pageFitPolicy(FitPolicy.WIDTH) // mode to fit pages in the view
                .fitEachPage(true) // fit each page to the view, else smaller pages are scaled relative to largest page.
                .pageSnap(false) // snap pages to screen boundaries
                .pageFling(false) // make a fling change only a single page like ViewPager
                .nightMode(false) // toggle night mode
                .load();
    }
    @Override
    public boolean onSupportNavigateUp() {

        Globals.selectedPdf = null;
        finish();
        return true;
    }
}