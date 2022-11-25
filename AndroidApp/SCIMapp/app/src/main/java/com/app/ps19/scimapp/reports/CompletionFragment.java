package com.app.ps19.scimapp.reports;

import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.TextView;

import com.app.ps19.scimapp.R;
import com.app.ps19.scimapp.Shared.Globals;
import com.app.ps19.scimapp.Shared.TemplatePlanCompletionView;
import com.app.ps19.scimapp.Shared.Utilities;
import com.app.ps19.scimapp.classes.CompRange;
import com.app.ps19.scimapp.classes.JourneyPlan;
import com.app.ps19.scimapp.classes.JourneyPlanOpt;
import com.app.ps19.scimapp.classes.Session;
import com.app.ps19.scimapp.classes.Units;
import com.app.ps19.scimapp.classes.UnitsOpt;
import com.app.ps19.scimapp.classes.User;

import java.util.ArrayList;
import java.util.Date;

import static com.app.ps19.scimapp.Shared.Globals.getPrefixMp;
import static com.app.ps19.scimapp.Shared.Globals.getSelectedUnit;
import static com.app.ps19.scimapp.Shared.Globals.selectedTask;
import static com.app.ps19.scimapp.Shared.Globals.setLocale;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link CompletionFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class CompletionFragment extends Fragment {

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    private WebView wView;
    private View viewLayout;
    private TextView tvTrackName;
    private TemplatePlanCompletionView tcTraverse;
    private TemplatePlanCompletionView tcObserve;
    public CompletionFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment CompletionFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static CompletionFragment newInstance(String param1, String param2) {
        CompletionFragment fragment = new CompletionFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        if(viewLayout==null){
            viewLayout=inflater.inflate(R.layout.fragment_completion, container, false);
            this.wView= viewLayout.findViewById(R.id.webView_fc);
            this.tcTraverse=viewLayout.findViewById(R.id.tcUnitCompletion);
            this.tcObserve =viewLayout.findViewById(R.id.tcUnitCompletion1);
            tvTrackName=viewLayout.findViewById(R.id.tvTrackName_fc);
            tvTrackName.setText("");
            showSessionsReport();
        }

        return viewLayout;
    }
    private void showSessionsReport(){
        JourneyPlanOpt wp= Globals.selectedJPlan.getTemplateOpt();
        JourneyPlan jp=Globals.selectedJPlan;
        boolean offlineMode=Globals.offlineMode;
        boolean currentUserOnly=offlineMode;
        Units unit=getSelectedUnit();
        tvTrackName.setText(unit.getDescription());
        String inspectionType="";
        //String nextDueDate=wp.getNextDueDate();
        Date date=wp.getNextDueDateToDate();
        long dateDiff=0;
        if(date !=null) {
            dateDiff= Utilities.getDateDiffInDays(date);
        }
        if(dateDiff>0){
            currentUserOnly=true;
        }
        if(jp.getTaskList().size()>0){
            if(!jp.getTaskList().get(0).getInspectionTypeTag().equals("required")){
                currentUserOnly=true;
                inspectionType=jp.getTaskList().get(0).getInspectionType();
            }
        }
        ArrayList<Session> sessions=new ArrayList<>();
        ArrayList<Session> tSessions=new ArrayList<>();
        ArrayList<Session> oSessions=new ArrayList<>();

        ArrayList<CompRange> ranges=wp.getCompletion().getRanges();
        ArrayList<Session> intervalSessions=null;
        if(currentUserOnly){
            if(jp.getIntervals()!=null){
                intervalSessions=jp.getIntervals().getSessions();
                for (Session _s :intervalSessions) {
                    if(_s.getTraverseTrack().equals(unit.getUnitId())){
                        tSessions.add(_s);
                    }
                    if(_s.getObserveTrack().equals(unit.getUnitId())){
                        oSessions.add(_s);
                    }

                    if(_s.getTraverseTrack().equals(unit.getUnitId()) || _s.getObserveTrack().equals(unit.getUnitId())){
                        sessions.add(_s);
                    }
                }
            }

        }else {
            for (CompRange range : ranges) {
                ArrayList<Session> _sessions = range.getSessions();
                for (Session _s : _sessions) {
                    if(_s.getTraverseTrack().equals(unit.getUnitId())){
                        tSessions.add(_s);
                    }
                    if(_s.getObserveTrack().equals(unit.getUnitId())){
                        oSessions.add(_s);
                    }
                    if(_s.getTraverseTrack().equals(unit.getUnitId()) || _s.getObserveTrack().equals(unit.getUnitId())){
                        sessions.add(_s);
                    }

                }
            }
        }
        //setLocale(this);
        StringBuilder sb=new StringBuilder();
        sb.append("<!DOCTYPE html>\n");
        sb.append("<html>\n");
        sb.append("<head>\n");
        sb.append("<style>");
        sb.append("#sessions {");
        sb.append("  font-family: Arial, Helvetica, sans-serif;");
        sb.append("  border-collapse: collapse;");
        sb.append("  width: 100%;");
        sb.append("}");

        sb.append("#sessions td, #sessions th {");
        sb.append("  border: 1px solid #ddd;");
        sb.append("  padding: 8px;");
        sb.append("}");

        sb.append("#sessions tr:nth-child(even){background-color: #f2f2f2;}");

        sb.append("#sessions tr:hover {background-color: #ddd;}");

        sb.append("#sessions .th-active {");
        sb.append("  padding-top: 12px;");
        sb.append("  padding-bottom: 12px;");
        sb.append("  text-align: left;");
        sb.append("  background-color: #4CAF50;");
        sb.append("  color: white;");
        sb.append("}");

        sb.append("#sessions .th-completed {");
        sb.append("  padding-top: 12px;");
        sb.append("  padding-bottom: 12px;");
        sb.append("  text-align: left;");
        sb.append("  background-color: #808080;");
        sb.append("  color: white;");
        sb.append("}");

        sb.append("</style>");

        sb.append("</head>\n");
        sb.append("<body>\n");
        sb.append("<h3>"+getResources().getString(R.string.report_template_sessions_title)+"</h3>\n");
        sb.append("<h4>"+wp.getTitle()+"</h4>\n");
        if(offlineMode){
            sb.append("<h5><font color=\"red\">"+getResources().getString(R.string.offline)+ ((!inspectionType.equals("required"))? ": "+inspectionType+" ":"")+"</font> [ "+getResources().getString(R.string.offline_curr_user_data)+" ]</h5>\n");
        }else if(currentUserOnly){
            if(dateDiff>0){
                sb.append("<h5><font color=\"red\">" + getResources().getString(R.string.due_date_in_days)+" : " + dateDiff +"" + "</font> [ " + getResources().getString(R.string.offline_curr_user_data) + " ]</h5>\n");
            }else {
                sb.append("<h5><font color=\"red\">" + inspectionType + "</font> [ " + getResources().getString(R.string.offline_curr_user_data) + " ]</h5>\n");
            }
        }
        float fStartMp= Float.valueOf(unit.getStart());
        float fEndMp= Float.valueOf(unit.getEnd());
        tcTraverse.setMpStart(fStartMp);
        tcTraverse.setMpEnd(fEndMp);
        tcTraverse.setCompletion(tSessions);

        tcObserve.setMpStart(fStartMp);
        tcObserve.setMpEnd(fEndMp);
        tcObserve.setCompletion(oSessions);

        //for(Session session:sessions){
        for(int i=0 ;i<sessions.size();i++){
            Session session=sessions.get(sessions.size()-i-1);
            CompRange cr=null;//(CompRange) session.getParent();
            User user;
            if(session.getParent() instanceof CompRange){
                cr=(CompRange) session.getParent();
                user=cr.getUser();
            }else{
                user=jp.getUser();
            }

            sb.append("<table id=\"sessions\">");
            sb.append("<tr>");
            if(session.getStatus().equals("closed")){
                sb.append("<th class=\"th-completed\" colspan=3>" + user.getName() + "</th>");
            }else {
                sb.append("<th class=\"th-active\" colspan=3>" + user.getName() + "</th>");
            }
            sb.append("</tr>");
            sb.append("<tr>");
            sb.append("<td>&nbsp;</td><td>"+getResources().getString(R.string.prompt_email)+"</td><td>"+user.getEmail()+"</td>");
            sb.append("</tr>");

            sb.append("<tr>");
            sb.append("<td>&nbsp;</td><td>"+getResources().getString(R.string.location_start)+"</td><td>"+getPrefixMp(session.getStart())+"</td>");
            sb.append("</tr>");

            sb.append("<tr>");
            sb.append("<td>&nbsp;</td><td>"+getResources().getString(R.string.time)+"</td><td>"+session.getStartTimeFormatted("MM-dd-yyyy hh:mm aaa")+"</td>");
            sb.append("</tr>");

            sb.append("<tr>");
            sb.append("<td>&nbsp;</td><td>"+getResources().getString(R.string.location_end)+"</td><td>"+getPrefixMp(session.getEnd())+"</td>");
            sb.append("</tr>");

            sb.append("<tr>");
            sb.append("<td>&nbsp;</td><td>"+getResources().getString(R.string.time)+"</td><td>"+session.getEndTimeFormatted("MM-dd-yyyy hh:mm aaa")+"</td>");
            sb.append("</tr>");

            Units tUnit=selectedTask.getUnitByID(session.getTraverseTrack());
            Units oUnit=selectedTask.getUnitByID(session.getObserveTrack());
            sb.append("<tr>");
            sb.append("<td>&nbsp;</td><td>"+getResources().getString(R.string.traversing)+"</td><td>"+(tUnit!=null?tUnit.getDescription():"")+"</td>");
            sb.append("</tr>");

            sb.append("<tr>");
            sb.append("<td>&nbsp;</td><td>"+getResources().getString(R.string.observing)+"</td><td>"+(oUnit!=null?oUnit.getDescription():"")+"</td>");
            sb.append("</tr>");

            sb.append("<tr>");
            sb.append("<td>&nbsp;</td><td>"+getResources().getString(R.string.status)+"</td><td>"+session.getStatus()+"</td>");
            sb.append("</tr>");
            sb.append("</table>");


        }
        sb.append("</body>\n");
        sb.append("</html>\n");
        String data=sb.toString();
        //wView.getSettings().setJavaScriptEnabled(true);

        WebSettings settings =wView.getSettings();
        settings.setBuiltInZoomControls(true);
        settings.setPluginState(WebSettings.PluginState.ON);
        settings.setJavaScriptEnabled(true);
        settings.setSupportZoom(true);
        wView.setWebChromeClient(
                new WebChromeClient() {
                    @Override
                    public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
                        //Required functionality here
                        return super.onJsAlert(view, url, message, result);
                    }

                    public void onProgressChanged(WebView view, int progress) {
                        //Make the bar disappear after URL is loaded, and changes string to Loading...
                        //setTitle(getString(R.string.loading_text));
                        //setProgress(progress * 100); //Make the bar disappear after URL is loaded

                        // Return the app name after finish loading
                        //if (progress == 100)
                        //setTitle(getString(R.string.report_web_title));
                    }
                }
        );

        wView.loadDataWithBaseURL(null, data, "text/html; charset=utf-8","UTF-8",null);
    }
}