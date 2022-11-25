package com.app.ps19.elecapp.inspection;

import static com.app.ps19.elecapp.Shared.Globals.SESSION_STARTED;
import static com.app.ps19.elecapp.Shared.Globals.activeSession;
import static com.app.ps19.elecapp.Shared.Globals.selectedJPlan;
import static com.app.ps19.elecapp.Shared.Utilities.elapsedCalculator;

import android.content.Context;
import android.os.Build;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseExpandableListAdapter;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.annotation.RequiresApi;

import com.app.ps19.elecapp.R;
import com.app.ps19.elecapp.classes.Session;
import com.app.ps19.elecapp.classes.Units;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;


public class SessionsAdapter extends BaseExpandableListAdapter {

    Context _context;
    LayoutInflater _Inflater;
    SimpleDateFormat dateTimeFormat = new SimpleDateFormat("hh:mm");
    private final ArrayList<Session> _sessionsList;
    int sessionCount = 0;

    Session prevSession;
    private static ArrayList<View> _sessionViews;

    public int getSessionCount(){
        return _sessionsList==null? 0:_sessionsList.size();
    }

    public SessionsAdapter(Context ctx) {
        this._context = ctx;
        this._Inflater = LayoutInflater.from(ctx);
        _sessionViews = new ArrayList<>();

        if (selectedJPlan != null) {
            this._sessionsList = new ArrayList<>();
            this._sessionsList.addAll(selectedJPlan.getIntervals().getSessions());
                Collections.reverse(this._sessionsList);

            if (_sessionsList.size() != 0 && activeSession == null) {
                sessionCount = _sessionsList.size();
                for (Session session : _sessionsList) {
                    if (session.getStatus().equals(SESSION_STARTED)) {
                        activeSession = session;
                        break;
                    }
                }
                if(activeSession==null){
                    activeSession=_sessionsList.get(0);
                }
            }
        } else {
            _sessionsList = new ArrayList<>();
        }

    }

    @Override
    public Session getChild(int listPosition, int expandedListPosition) {
        return _sessionsList.get(listPosition);
    }

    @Override
    public long getChildId(int groupPosition, int childPosition) {
        return getChild(groupPosition,childPosition).hashCode();
    }

    @Override
    public View getChildView(int groupPosition, final int childPosition,
                             boolean isLastChild, View convertView, ViewGroup parent) {

        View sessions3rdLevel = convertView;

        if(sessions3rdLevel == null) {
            sessions3rdLevel = _Inflater.inflate(R.layout.fragment_session_third_level_view, parent, false);
        }

        TextView tv_traverse_Track = (TextView) sessions3rdLevel.findViewById(R.id.tv_traverse_track);
        TextView tv_observe_track = (TextView) sessions3rdLevel.findViewById(R.id.tv_observe_track);

        Session session = (Session) getChild(groupPosition,childPosition);
        tv_traverse_Track.setText("N/A");
        tv_observe_track.setText("N/A");

        boolean isTraverseIDAvailable = !session.getTraverseTrack().isEmpty();
        boolean isObserveIDAvailable = !session.getObserveTrack().isEmpty();
        boolean hasTraverseUnit = session.getTraverse() != null;
        boolean hasObserveUnit = session.getObserve() != null;

        if (isTraverseIDAvailable && hasTraverseUnit) {
            tv_traverse_Track.setText(session.getTraverse().getDescription());
        }

        if (isObserveIDAvailable && hasObserveUnit) {
            tv_observe_track.setText(session.getObserve().getDescription());
        }

        if(tv_traverse_Track.getText().equals("N/A") || tv_observe_track.getText().equals("N/A")) {

            if(isTraverseIDAvailable && !hasTraverseUnit) {
                setUnitDescription(session, tv_traverse_Track,true);
            }

            if(isObserveIDAvailable && !hasObserveUnit) {
                setUnitDescription(session, tv_observe_track, false);
            }

        }
        if(session.isAllSideTracks()){
            tv_observe_track.setText("All Side Tracks");
        }
        return sessions3rdLevel;

    }


    private void setUnitDescription(Session session, TextView tv, boolean isTraverse) {
        for (Units unit : selectedJPlan.getTaskList().get(0).getWholeUnitList()) {
            if (isTraverse) {
                if (unit.getUnitId().equals(session.getTraverseTrack())) {
                    tv.setText(unit.getDescription());
                    break;
                }
            } else {
                if (unit.getUnitId().equals(session.getObserveTrack())) {
                    tv.setText(unit.getDescription());
                    break;
                }
            }
        }
    }

    @Override
    public int getChildrenCount(int listPosition) {
        return 1; // We have only 1 children adapter as an expandable list view here
    }

    @Override
    public Session getGroup(int groupPosition) {
        return _sessionsList.get(groupPosition);
    }

    @Override
    public int getGroupCount() {
        return _sessionsList.size();
    }

    @Override
    public long getGroupId(int listPosition) {
        return getGroup(listPosition).hashCode();
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @Override
    public View getGroupView(int groupPosition, boolean isExpanded,
                             View view, ViewGroup parent) {

        if(view == null) {
            view =_Inflater.inflate(R.layout.fragment_session_second_level_view, parent, false);

        }

        TextView tvSessionTitle = (TextView) view.findViewById(R.id.tv_session_title);
        TextView tvStartMP = (TextView) view.findViewById(R.id.tv_session_startMP);
        TextView tvEndMP = (TextView) view.findViewById(R.id.tv_session_endMP);
        TextView tvSessionStartDateTime = (TextView) view.findViewById(R.id.tv_session_duration);

        tvStartMP.setText("--:--");
        tvEndMP.setText("--:--");

        Session session = (Session) getGroup(groupPosition);


        Date startTime = new Date();

        if (!session.getStatus().equals(SESSION_STARTED)) {
            startTime = new Date(session.getEndTime());
        }

        tvStartMP.setText(session.getStart());
        tvEndMP.setText(session.getEnd());


        String sessionTitle =  "Session " + Integer.toString(getGroupCount() - groupPosition);
        tvSessionTitle.setText(sessionTitle);

        final int[] elapsedTime = elapsedCalculator(startTime, new Date(session.getStartTime()));
        // String days = elapsedTime[0] + "d ";
        String hours = elapsedTime[1] + "h";
        String mins = elapsedTime[2] + "m";

        tvSessionStartDateTime.setText(hours + ":" + mins);

        if(_sessionViews.size() < 1 && !_sessionViews.contains(view)) {//we only have to add first session
            _sessionViews.add(view);
        }

        return view;
    }

    public void UpdateSessionTimeString(String time){
        if(_sessionViews.size() > 0) {
            View runningSession = _sessionViews.get(0);
            TextView tvSessionStartDateTime = (TextView) runningSession.findViewById(R.id.tv_session_duration);
            tvSessionStartDateTime.setText(time);
        }
    }

    public void UpdateRunningSessionColor(){
        if(_sessionViews.size() == 0) {return;}

        if(activeSession != null) {
            View runningSession = _sessionViews.get(0);
            RelativeLayout rl_session = (RelativeLayout) runningSession.findViewById(R.id.rl_session);
            rl_session.setBackgroundColor(_context.getResources().getColor(R.color.gradient_green_light));
        }
    }

    @Override
    public boolean hasStableIds() {
        return true;
    }

    @Override
    public boolean isChildSelectable(int listPosition, int expandedListPosition) {
        return true;
    }

}