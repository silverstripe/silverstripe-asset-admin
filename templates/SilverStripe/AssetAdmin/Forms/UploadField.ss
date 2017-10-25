<div class="uploadfield-holder">
    <% if $Items %>
        <div class="entwine-placeholder">
            <% loop $Items %>
                <input type="hidden" name="$Up.Name[Files][]" value="$ID.ATT" />
            <% end_loop %>
        </div>
    <% end_if %>
</div>
<input $AttributesHTML <% include SilverStripe/Forms/AriaAttributes %> />
